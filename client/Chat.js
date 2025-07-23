import { Component, useState } from './MiniFramework/app/state.js';
import { createElement } from './MiniFramework/app/dom.js';
import { eventManager } from './MiniFramework/app/events.js';
import { ClientId } from './game.js';

export class Chat {
    constructor(ws) {
        this.ws = ws;
        this.messages = [];
        this.setupEvents();
    }

    addMessage(player, message) {

        console.log("pll", player, "msff", message);

        this.messages.push({ player, message });
        if (this.messages.length > 10) this.messages.shift();
        this.render();
    }

    setupEvents() {
        eventManager.addevent("keydown", ".chat-input", (e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
                this.ws.send(JSON.stringify({
                    signal: "ChatMessage",
                    message: e.target.value.trim(),
                    ClientId: ClientId
                }));
                e.target.value = "";
            }
        });
    }

    render() {
        return createElement("div", { class: "chat-container" },
            createElement("div", { class: "messages" },
                ...this.messages.map(msg =>
                    createElement("div", { class: "message" },
                        createElement("span", { class: "player" }, `${msg.player}: `),
                        createElement("span", { class: "text" }, msg.message)
                    )
                )
            ),
            createElement("input", {
                class: "chat-input",
                placeholder: "Type message...",
                type: "text"
            })
        );
    }

    handleIncomingMessage(data) {
        console.log("daaaata", data);

        // if (data.signal === "ChatMessage") {
        this.addMessage(data.player, data.message);

    }
}