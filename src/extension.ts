import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function findModelfiles(workspaceFolder: vscode.WorkspaceFolder): Promise<vscode.Uri[]> {
	const pattern = new vscode.RelativePattern(workspaceFolder, '**/*.modelfile');
	const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
	
	const modelFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(workspaceFolder, '**/Modelfile'), '**/node_modules/**');
	
	return [...files, ...modelFiles];
}

class OutputChannelManager {
	private static instance: OutputChannelManager;
	private modelRunChannel?: vscode.OutputChannel;

	private constructor() {}

	static getInstance(): OutputChannelManager {
		if (!OutputChannelManager.instance) {
			OutputChannelManager.instance = new OutputChannelManager();
		}
		return OutputChannelManager.instance;
	}

	getModelRunChannel(): vscode.OutputChannel {
		if (!this.modelRunChannel) {
			this.modelRunChannel = vscode.window.createOutputChannel('Ollama Model Run');
		}
		return this.modelRunChannel;
	}

	dispose() {
		if (this.modelRunChannel) {
			this.modelRunChannel.dispose();
			this.modelRunChannel = undefined;
		}
	}
}

function cleanOutput(text: string): string {
	return text
		.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
		.replace(/\[(\d+|k)m/g, '')
		.replace(/\[\?25[hl]/g, '')
		.replace(/\[2K/g, '')
		.replace(/\r/g, '')
		.replace(/\u001b/g, '')
		.replace(/\[25l|\[25h|\[2K|\[1G/g, '');
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-ollama-modelfile" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('ollama-modelfile.createModelfile', async () => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				vscode.window.showErrorMessage('Please open a workspace first');
				return;
			}

			const fileName = await vscode.window.showInputBox({
				prompt: 'Enter Modelfile name',
				placeHolder: 'e.g., chatbot, coder, assistant',
				validateInput: (value) => {
					if (!value) {
						return 'File name cannot be empty';
					}
					if (value.includes('/') || value.includes('\\')) {
						return 'File name cannot contain path separators';
					}
					return null;
				}
			});

			if (!fileName) {
				return;
			}

			const templateType = await vscode.window.showQuickPick([
				{ label: 'Basic Model', description: 'Basic model with essential settings' },
				{ label: 'Chat Assistant', description: 'Model configured for chat interactions' },
				{ label: 'Custom Parameters', description: 'Model with advanced parameter settings' },
				{ label: 'With Message History', description: 'Model with predefined conversation history' }
			], {
				placeHolder: 'Select a Modelfile template'
			});

			if (!templateType) {
				return;
			}

			let templateContent = '';
			switch (templateType.label) {
				case 'Basic Model':
					templateContent = `# Basic Modelfile
FROM deepseek-r1:1.5b

# Set basic parameters
PARAMETER temperature 0.7
PARAMETER num_ctx 4096

# Set system message
SYSTEM """You are a helpful AI assistant."""`;
					break;

				case 'Chat Assistant':
					templateContent = `# Chat Assistant Modelfile
FROM deepseek-r1:1.5b

# Configure the chat behavior
SYSTEM """You are a friendly and helpful AI assistant. You provide clear, 
accurate, and concise responses while maintaining a conversational tone."""

# Set chat-optimized parameters
PARAMETER temperature 0.8
PARAMETER top_p 0.9
PARAMETER top_k 50

# Define chat template
TEMPLATE """{{ if .System }}
<|im_start|>system
{{ .System }}
<|im_end|>
{{ end }}
{{ if .Prompt }}
<|im_start|>user
{{ .Prompt }}
<|im_end|>
{{ end }}
<|im_start|>assistant
{{ .Response }}
<|im_end|>"""`;
					break;

				case 'Custom Parameters':
					templateContent = `# Advanced Parameters Modelfile
FROM deepseek-r1:1.5b

# Comprehensive parameter configuration
PARAMETER temperature 0.7    # Controls creativity (0.1-2.0)
PARAMETER top_k 40          # Limits vocabulary diversity
PARAMETER top_p 0.9         # Nucleus sampling threshold
PARAMETER num_ctx 4096      # Context window size
PARAMETER repeat_penalty 1.1 # Repetition penalty
PARAMETER mirostat 1        # Sampling control (0,1,2)
PARAMETER mirostat_tau 5.0  # Target entropy
PARAMETER mirostat_eta 0.1  # Learning rate

# System configuration
SYSTEM """You are an AI assistant with advanced capabilities."""`;
					break;

				case 'With Message History':
					templateContent = `# Modelfile with Message History
FROM deepseek-r1:1.5b

# Configure base behavior
SYSTEM """You are a helpful AI assistant with consistent response patterns."""

# Example conversation history
MESSAGE user "What's the weather like?"
MESSAGE assistant "I apologize, but I don't have access to real-time weather data. You would need to check a weather service or look outside for current weather conditions."
MESSAGE user "Can you help me with coding?"
MESSAGE assistant "Of course! I'd be happy to help you with programming. Please share your specific coding question or the problem you're trying to solve."

# Parameters for conversation
PARAMETER temperature 0.7
PARAMETER num_ctx 4096
PARAMETER repeat_penalty 1.1`;
					break;
			}

			const fullFileName = fileName.toLowerCase().endsWith('.modelfile') 
				? fileName 
				: `${fileName}.modelfile`;

			const uri = vscode.Uri.file(
				path.join(workspaceFolders[0].uri.fsPath, fullFileName)
			);

			try {
				await vscode.workspace.fs.stat(uri);
				const overwrite = await vscode.window.showWarningMessage(
					`File ${fullFileName} already exists. Do you want to overwrite it?`,
					'Yes',
					'No'
				);
				if (overwrite !== 'Yes') {
					return;
				}
			} catch (err) {
			}

			try {
				await vscode.workspace.fs.writeFile(uri, Buffer.from(templateContent));
				const doc = await vscode.workspace.openTextDocument(uri);
				await vscode.window.showTextDocument(doc);
				vscode.window.showInformationMessage(`Modelfile '${fullFileName}' created successfully!`);
			} catch (err) {
				vscode.window.showErrorMessage(`Failed to create Modelfile: ${err}`);
			}
		}),
		
		vscode.commands.registerCommand('ollama-modelfile.createModel', async () => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				vscode.window.showErrorMessage('Please open a workspace first');
				return;
			}

			let allModelfiles: vscode.Uri[] = [];
			for (const folder of workspaceFolders) {
				const files = await findModelfiles(folder);
				allModelfiles = allModelfiles.concat(files);
			}

			if (allModelfiles.length === 0) {
				vscode.window.showErrorMessage('No Modelfile found in workspace');
				return;
			}

			const modelfileItems = allModelfiles.map(file => ({
				label: path.basename(file.fsPath),
				description: vscode.workspace.asRelativePath(file.fsPath),
				uri: file
			}));

			const selectedModelfile = await vscode.window.showQuickPick(modelfileItems, {
				placeHolder: 'Select a Modelfile',
				title: 'Create Model'
			});

			if (!selectedModelfile) {
				return;
			}

			const defaultModelName = path.basename(selectedModelfile.label, '.modelfile').toLowerCase() + ':0.0.1';

			const modelNameInput = await vscode.window.showInputBox({
				prompt: 'Enter model name and tag',
				placeHolder: 'modelname:tag',
				value: defaultModelName,
				validateInput: (value) => {
					if (!value) {
						return 'Model name cannot be empty';
					}
					if (!/^[a-zA-Z0-9_-]+(?::[a-zA-Z0-9._-]+)?$/.test(value)) {
						return 'Invalid model name format. Use modelname:tag';
					}
					return null;
				}
			});

			if (!modelNameInput) {
				return;
			}

			const outputChannel = OutputChannelManager.getInstance().getModelRunChannel();
			outputChannel.clear();
			outputChannel.show();

			try {
				outputChannel.appendLine(`Creating model ${modelNameInput} from ${selectedModelfile.description}...`);
				const { stdout, stderr } = await execAsync(`ollama create ${modelNameInput} -f "${selectedModelfile.uri.fsPath}"`);
				outputChannel.appendLine(stdout);
				if (stderr) {
					outputChannel.appendLine(`Warnings: ${stderr}`);
				}
				vscode.window.showInformationMessage(`Model ${modelNameInput} created successfully!`);
			} catch (error: any) {
				outputChannel.appendLine(`Error: ${error.message}`);
				vscode.window.showErrorMessage(`Failed to create model: ${error.message}`);
			}
		}),
		
		vscode.commands.registerCommand('ollama-modelfile.runModel', async () => {
			try {
				const { stdout } = await execAsync('ollama list');
				const models = stdout.split('\n')
					.filter(line => line.trim())
					.map(line => line.split(' ')[0])
					.filter(model => model && model !== 'NAME');

				const selectedModel = await vscode.window.showQuickPick(models, {
					placeHolder: 'Select a model to run'
				});

				if (!selectedModel) {
					return;
				}

				const prompt = await vscode.window.showInputBox({
					prompt: 'Enter your prompt',
					placeHolder: 'e.g., What is the meaning of life?'
				});

				if (!prompt) {
					return;
				}

				const outputChannel = OutputChannelManager.getInstance().getModelRunChannel();
				outputChannel.show();
				outputChannel.appendLine(`Running model ${selectedModel}...`);
				outputChannel.appendLine(`Prompt: ${prompt}`);
				outputChannel.appendLine('-------------------\nResponse:');

				const { spawn } = require('child_process');
				const child = spawn('ollama', ['run', selectedModel], {
					stdio: ['pipe', 'pipe', 'pipe']
				});

				child.stdin.write(prompt + '\n');
				child.stdin.end();

				child.stdout.on('data', (data: Buffer) => {
					outputChannel.append(data.toString());
				});

				child.stderr.on('data', (data: Buffer) => {
				});

				child.on('error', (error: Error) => {
					outputChannel.appendLine(`\nError: ${error.message}`);
				});

				child.on('close', (code: number) => {
					outputChannel.appendLine('\n-------------------');
					outputChannel.appendLine(code === 0 ? 'Process completed successfully.' : `Process exited with code ${code}`);
				});

			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(`Failed to run model: ${errorMessage}`);
			}
		}),

		vscode.commands.registerCommand('ollama-modelfile.deleteModel', async () => {
			try {
				const { stdout } = await execAsync('ollama list');
				const models = stdout.split('\n')
					.filter(line => line.trim())
					.map(line => line.split(' ')[0])
					.filter(model => model && model !== 'NAME');

				if (models.length === 0) {
					vscode.window.showInformationMessage('No models available to delete');
					return;
				}

				const selectedModel = await vscode.window.showQuickPick(models, {
					placeHolder: 'Select a model to delete'
				});

				if (!selectedModel) {
					return;
				}

				const confirmation = await vscode.window.showWarningMessage(
					`Are you sure you want to delete model '${selectedModel}'?`,
					'Yes',
					'No'
				);

				if (confirmation !== 'Yes') {
					return;
				}

				await execAsync(`ollama rm ${selectedModel}`);
				vscode.window.showInformationMessage(`Model '${selectedModel}' has been deleted`);

			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(`Failed to delete model: ${errorMessage}`);
			}
		})
	);
}

export function deactivate() {
	OutputChannelManager.getInstance().dispose();
}
