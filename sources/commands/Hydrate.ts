import {Command} from 'clipanion';
import path from 'path';
import tar from 'tar';

import * as folderUtils from '../folderUtils';
import {Context} from '../main';

export class HydrateCommand extends Command<Context> {
    static usage = Command.Usage({
        description: `Import a package manager into the cache`,
        details: `
            This command unpacks a package manager archive into the cache. The archive must have been generated by the \`pmm pack\` command - no other will work.
        `,
        examples: [[
            `Import a package manager in the cache`,
            `$0 hydrate pmm-yarn-2.2.2.tgz`,
        ]],
    });

    @Command.String()
    fileName!: string;

    @Command.Path(`hydrate`)
    async execute() {
        const installFolder = folderUtils.getInstallFolder();
        const fileName = path.resolve(this.context.cwd);

        await tar.x({file: fileName, strip: 1, cwd: installFolder});
    }
}
