import type { Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { sql, MSSQL } from '@codemirror/lang-sql';
import { LanguageSupport, StreamLanguage, type StreamParser } from '@codemirror/language';
import { completeAnyWord, completeFromList, type Completion } from '@codemirror/autocomplete';
import { csharp } from '@codemirror/legacy-modes/mode/clike';
import { diff } from '@codemirror/legacy-modes/mode/diff';
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile';
import { powerShell } from '@codemirror/legacy-modes/mode/powershell';
import { properties } from '@codemirror/legacy-modes/mode/properties';
import { python } from '@codemirror/legacy-modes/mode/python';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { toml } from '@codemirror/legacy-modes/mode/toml';
import { xml } from '@codemirror/legacy-modes/mode/xml';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { log } from './log.js';

/** Language identifiers shared by the CodeMirror editor and rich code blocks */
export type CodeLanguageId =
	| 'plaintext'
	| 'javascript'
	| 'typescript'
	| 'html'
	| 'css'
	| 'json'
	| 'markdown'
	| 'sql'
	| 'csharp'
	| 'powershell'
	| 'python'
	| 'shell'
	| 'yaml'
	| 'xml'
	| 'toml'
	| 'ini'
	| 'dockerfile'
	| 'diff'
	| 'log';

export interface CodeLanguageDef {
	/** Value stored in a code block's language attribute and `language-` CSS class */
	id: CodeLanguageId;
	/** Human-readable name shown in the language picker */
	label: string;
	/** Alternative names recognised when parsing existing content (e.g. 'cs' for csharp) */
	aliases: string[];
	/** Factory for the CodeMirror language support (highlighting + completions) */
	load: () => Extension;
}

// Languages without a native CodeMirror 6 package use legacy stream parsers. Those provide
// highlighting only, so keyword lists plus word matching stand in for the scope-aware
// completions the native language packages ship with.
const CSHARP_KEYWORDS = (
	'abstract as async await base bool break byte case catch char checked class const continue ' +
	'decimal default delegate do double dynamic else enum event explicit extern false finally fixed ' +
	'float for foreach get global goto if implicit in init int interface internal is lock long ' +
	'nameof namespace new null object operator out override params partial private protected public ' +
	'readonly record ref required return sbyte sealed set short sizeof stackalloc static string ' +
	'struct switch this throw true try typeof uint ulong unchecked unsafe ushort using value var ' +
	'virtual void volatile when where while yield'
).split(' ');

const CSHARP_COMMON_TYPES = (
	'Console Convert DateTime Dictionary Exception Guid IEnumerable IList List Math Nullable ' +
	'Object StringBuilder Task TimeSpan'
).split(' ');

const POWERSHELL_KEYWORDS = (
	'begin break catch class continue data do dynamicparam else elseif end enum exit filter ' +
	'finally for foreach from function hidden if in param process return static switch throw trap ' +
	'try until using var while workflow'
).split(' ');

const POWERSHELL_CMDLETS = (
	'Add-Content Add-Member Clear-Content Clear-Variable Compare-Object ConvertFrom-Json ' +
	'ConvertTo-Json Copy-Item Export-Csv ForEach-Object Format-List Format-Table Get-ChildItem ' +
	'Get-Command Get-Content Get-Date Get-Help Get-Item Get-ItemProperty Get-Location Get-Member ' +
	'Get-Module Get-Process Get-Random Get-Service Get-Variable Group-Object Import-Csv ' +
	'Import-Module Install-Module Invoke-Command Invoke-Expression Invoke-RestMethod ' +
	'Invoke-WebRequest Join-Path Measure-Object Move-Item New-Item New-Object Out-File Out-Null ' +
	'Read-Host Remove-Item Remove-Variable Rename-Item Resolve-Path Restart-Service Select-Object ' +
	'Select-String Set-Content Set-ExecutionPolicy Set-Item Set-Location Set-Variable Sort-Object ' +
	'Split-Path Start-Process Start-Service Start-Sleep Stop-Process Stop-Service Tee-Object ' +
	'Test-Connection Test-Path Wait-Process Where-Object Write-Debug Write-Error Write-Host ' +
	'Write-Output Write-Verbose Write-Warning'
).split(' ');

const PYTHON_KEYWORDS = (
	'and as assert async await break case class continue def del elif else except False finally ' +
	'for from global if import in is lambda match None nonlocal not or pass raise return True try ' +
	'while with yield'
).split(' ');

const PYTHON_BUILTINS = (
	'abs all any bool dict enumerate filter float getattr hasattr int isinstance len list map max ' +
	'min next open print range repr reversed round set setattr sorted str sum super tuple type zip'
).split(' ');

function toCompletions(words: string[], type: string): Completion[] {
	return words.map((label) => ({ label, type }));
}

function legacySupport(parser: StreamParser<unknown>, completions: Completion[] = []): Extension {
	const language = StreamLanguage.define(parser);
	return new LanguageSupport(language, [
		language.data.of({ autocomplete: completeFromList(completions) }),
		language.data.of({ autocomplete: completeAnyWord })
	]);
}

/** Every language the CodeMirror editor and rich code blocks can highlight */
export const codeLanguages: CodeLanguageDef[] = [
	{
		id: 'plaintext',
		label: 'Plain text',
		aliases: ['text', 'plain', 'txt', 'none'],
		load: () => []
	},
	{
		id: 'javascript',
		label: 'JavaScript',
		aliases: ['js', 'jsx', 'mjs', 'node'],
		load: () => javascript({ jsx: true })
	},
	{
		id: 'typescript',
		label: 'TypeScript',
		aliases: ['ts', 'tsx'],
		load: () => javascript({ typescript: true, jsx: true })
	},
	{
		id: 'html',
		label: 'HTML',
		aliases: ['markup', 'xhtml'],
		load: () => html()
	},
	{
		id: 'css',
		label: 'CSS',
		aliases: ['scss', 'less'],
		load: () => css()
	},
	{
		id: 'json',
		label: 'JSON',
		aliases: ['jsonc'],
		load: () => json()
	},
	{
		id: 'markdown',
		label: 'Markdown',
		aliases: ['md'],
		load: () => markdown()
	},
	{
		id: 'sql',
		label: 'SQL',
		aliases: ['tsql', 'mssql', 'sqlserver', 'mysql', 'postgres', 'postgresql', 'sqlite', 'plsql'],
		// T-SQL dialect: covers standard SQL plus SQL Server extras
		// ([bracketed] identifiers, @variables, TOP, NVARCHAR, ...)
		load: () => sql({ dialect: MSSQL, upperCaseKeywords: true })
	},
	{
		id: 'csharp',
		label: 'C#',
		aliases: ['cs', 'c#', 'dotnet'],
		load: () =>
			legacySupport(csharp, [
				...toCompletions(CSHARP_KEYWORDS, 'keyword'),
				...toCompletions(CSHARP_COMMON_TYPES, 'class')
			])
	},
	{
		id: 'powershell',
		label: 'PowerShell',
		aliases: ['ps', 'ps1', 'psm1', 'psd1', 'pwsh', 'posh'],
		load: () =>
			legacySupport(powerShell, [
				...toCompletions(POWERSHELL_KEYWORDS, 'keyword'),
				...toCompletions(POWERSHELL_CMDLETS, 'function')
			])
	},
	{
		id: 'python',
		label: 'Python',
		aliases: ['py', 'python3'],
		load: () =>
			legacySupport(python, [
				...toCompletions(PYTHON_KEYWORDS, 'keyword'),
				...toCompletions(PYTHON_BUILTINS, 'function')
			])
	},
	{
		id: 'shell',
		label: 'Shell',
		aliases: ['sh', 'bash', 'zsh'],
		load: () => legacySupport(shell)
	},
	{
		id: 'yaml',
		label: 'YAML',
		aliases: ['yml'],
		load: () => legacySupport(yaml)
	},
	{
		// 'xml' and 'svg' were HTML aliases; the XML parser reads them more accurately.
		id: 'xml',
		label: 'XML',
		aliases: ['svg', 'xsd', 'xsl', 'xslt', 'csproj'],
		load: () => legacySupport(xml)
	},
	{
		id: 'toml',
		label: 'TOML',
		aliases: [],
		load: () => legacySupport(toml)
	},
	{
		id: 'ini',
		label: 'INI',
		aliases: ['properties', 'conf', 'cfg', 'env'],
		load: () => legacySupport(properties)
	},
	{
		id: 'dockerfile',
		label: 'Dockerfile',
		aliases: ['docker', 'containerfile'],
		load: () => legacySupport(dockerFile)
	},
	{
		id: 'diff',
		label: 'Diff',
		aliases: ['patch'],
		load: () => legacySupport(diff)
	},
	{
		id: 'log',
		label: 'Log',
		aliases: ['logs'],
		load: () => log()
	}
];

/** Look up a language definition by id or alias (case-insensitive) */
export function resolveCodeLanguage(
	language: string | null | undefined
): CodeLanguageDef | undefined {
	if (!language) return undefined;
	const normalized = language.toLowerCase();
	return codeLanguages.find((def) => def.id === normalized || def.aliases.includes(normalized));
}
