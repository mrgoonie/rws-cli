/**
 * Command: rws completion
 * Generates shell completion scripts
 */

import { Command } from 'commander';

const BASH_COMPLETION = `
# rws bash completion
_rws_completions() {
    local cur prev opts
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"

    # Top-level commands
    local commands="review convert extract scrape summarize seo api-key screenshot url-check profile config health completion"

    # Subcommands
    local review_cmds="create get list update delete"
    local convert_cmds="markdown markdown-batch"
    local extract_cmds="data"
    local scrape_cmds="url extract"
    local summarize_cmds="url website"
    local seo_cmds="backlinks keyword-ideas keyword-difficulty traffic"
    local apikey_cmds="create list delete"
    local config_cmds="set get delete list path"
    local completion_cmds="bash zsh fish"

    case "\${COMP_WORDS[1]}" in
        review)
            COMPREPLY=( \$(compgen -W "\${review_cmds}" -- \${cur}) )
            return 0
            ;;
        convert)
            COMPREPLY=( \$(compgen -W "\${convert_cmds}" -- \${cur}) )
            return 0
            ;;
        extract)
            COMPREPLY=( \$(compgen -W "\${extract_cmds}" -- \${cur}) )
            return 0
            ;;
        scrape)
            COMPREPLY=( \$(compgen -W "\${scrape_cmds}" -- \${cur}) )
            return 0
            ;;
        summarize)
            COMPREPLY=( \$(compgen -W "\${summarize_cmds}" -- \${cur}) )
            return 0
            ;;
        seo)
            COMPREPLY=( \$(compgen -W "\${seo_cmds}" -- \${cur}) )
            return 0
            ;;
        api-key)
            COMPREPLY=( \$(compgen -W "\${apikey_cmds}" -- \${cur}) )
            return 0
            ;;
        config)
            COMPREPLY=( \$(compgen -W "\${config_cmds}" -- \${cur}) )
            return 0
            ;;
        completion)
            COMPREPLY=( \$(compgen -W "\${completion_cmds}" -- \${cur}) )
            return 0
            ;;
    esac

    if [[ \${COMP_CWORD} -eq 1 ]] ; then
        COMPREPLY=( \$(compgen -W "\${commands}" -- \${cur}) )
        return 0
    fi
}
complete -F _rws_completions rws
`;

const ZSH_COMPLETION = `
#compdef rws

_rws() {
    local -a commands
    commands=(
        'review:Manage website reviews'
        'convert:Convert web content to different formats'
        'extract:Extract structured data from web content'
        'scrape:Scrape web content and extract data'
        'summarize:Summarize web content using AI'
        'seo:SEO insights and analysis'
        'api-key:Manage API keys'
        'screenshot:Take a screenshot of a URL'
        'url-check:Check if a URL is alive'
        'profile:Get current user profile'
        'config:Manage CLI configuration'
        'health:Check API health status'
        'completion:Generate shell completion scripts'
    )

    _arguments -C \\
        '1: :->command' \\
        '*: :->args'

    case \$state in
        command)
            _describe -t commands 'rws commands' commands
            ;;
        args)
            case \$words[2] in
                review)
                    _values 'subcommand' 'create' 'get' 'list' 'update' 'delete'
                    ;;
                convert)
                    _values 'subcommand' 'markdown' 'markdown-batch'
                    ;;
                extract)
                    _values 'subcommand' 'data'
                    ;;
                scrape)
                    _values 'subcommand' 'url' 'extract'
                    ;;
                summarize)
                    _values 'subcommand' 'url' 'website'
                    ;;
                seo)
                    _values 'subcommand' 'backlinks' 'keyword-ideas' 'keyword-difficulty' 'traffic'
                    ;;
                api-key)
                    _values 'subcommand' 'create' 'list' 'delete'
                    ;;
                config)
                    _values 'subcommand' 'set' 'get' 'delete' 'list' 'path'
                    ;;
                completion)
                    _values 'shell' 'bash' 'zsh' 'fish'
                    ;;
            esac
            ;;
    esac
}

_rws
`;

const FISH_COMPLETION = `
# rws fish completion

# Disable file completion by default
complete -c rws -f

# Main commands
complete -c rws -n "__fish_use_subcommand" -a "review" -d "Manage website reviews"
complete -c rws -n "__fish_use_subcommand" -a "convert" -d "Convert web content"
complete -c rws -n "__fish_use_subcommand" -a "extract" -d "Extract structured data"
complete -c rws -n "__fish_use_subcommand" -a "scrape" -d "Scrape web content"
complete -c rws -n "__fish_use_subcommand" -a "summarize" -d "Summarize web content"
complete -c rws -n "__fish_use_subcommand" -a "seo" -d "SEO insights"
complete -c rws -n "__fish_use_subcommand" -a "api-key" -d "Manage API keys"
complete -c rws -n "__fish_use_subcommand" -a "screenshot" -d "Take screenshots"
complete -c rws -n "__fish_use_subcommand" -a "url-check" -d "Check URL status"
complete -c rws -n "__fish_use_subcommand" -a "profile" -d "Get user profile"
complete -c rws -n "__fish_use_subcommand" -a "config" -d "Manage configuration"
complete -c rws -n "__fish_use_subcommand" -a "health" -d "Check API health"
complete -c rws -n "__fish_use_subcommand" -a "completion" -d "Shell completions"

# Review subcommands
complete -c rws -n "__fish_seen_subcommand_from review" -a "create get list update delete"

# Convert subcommands
complete -c rws -n "__fish_seen_subcommand_from convert" -a "markdown markdown-batch"

# Extract subcommands
complete -c rws -n "__fish_seen_subcommand_from extract" -a "data"

# Scrape subcommands
complete -c rws -n "__fish_seen_subcommand_from scrape" -a "url extract"

# Summarize subcommands
complete -c rws -n "__fish_seen_subcommand_from summarize" -a "url website"

# SEO subcommands
complete -c rws -n "__fish_seen_subcommand_from seo" -a "backlinks keyword-ideas keyword-difficulty traffic"

# API key subcommands
complete -c rws -n "__fish_seen_subcommand_from api-key" -a "create list delete"

# Config subcommands
complete -c rws -n "__fish_seen_subcommand_from config" -a "set get delete list path"

# Completion subcommands
complete -c rws -n "__fish_seen_subcommand_from completion" -a "bash zsh fish"
`;

export const completionCommand = new Command('completion')
  .description('Generate shell completion scripts')
  .argument('<shell>', 'Shell type: bash, zsh, fish')
  .action((shell: string) => {
    switch (shell.toLowerCase()) {
      case 'bash':
        console.log(BASH_COMPLETION);
        break;
      case 'zsh':
        console.log(ZSH_COMPLETION);
        break;
      case 'fish':
        console.log(FISH_COMPLETION);
        break;
      default:
        console.error(`Unknown shell: ${shell}. Supported: bash, zsh, fish`);
        process.exit(1);
    }
  });
