import { updatePlayerList } from "./display.js";

export class Player {
    constructor(stats, uuid) {
        this.stats = stats.stats;
        this.uuid = uuid;
        this.dataVersion = stats.DataVersion;

        fetch(`https://playerdb.co/api/player/minecraft/${this.uuid}`).then(
            r => r.json()
            ).then(
                json => {
                    this.info = json;
                    this.name = json.data.player.username;
                    updatePlayerList()
                }
            );
    };
};