const transcriptionsContainer = document.getElementById("transcriptions");

const socket = io();

socket.on("NewTranscription", (data) => {
    console.log(data);
    const element = new Transcription(data);
    transcriptionsContainer.append(element);
    element.scrollIntoView({behavior: "smooth"});
});

socket.on("UpdateTranscription", (data) => {
    const element = document.getElementById(data.id);
    element.replaceText(data.text);
});

socket.on("EndTranscription", (data) => {
    const element = document.getElementById(data.id);
    const loadingElement = element?.querySelector(".loading");
    loadingElement?.remove();
});

class Transcription extends HTMLElement {
    /** @param {TranscriptionElement} data */
    constructor(data) {
        super();

        const template = document.getElementById("transcription-template");
        if(!(template instanceof HTMLTemplateElement)) throw new Error("Message template not existent on DOM");

        this.replaceChildren(template.content.cloneNode(true));
        this.assignId(data.id);
        this.insertAvatar(data.member.avatar);
        this.insertName(data.member.name);

        if(data.text) {
            this.replaceText(data.text);
        } else {
            const loadingTemplate = document.getElementById("loading-template");
            const textContainer = this.querySelector(".message");

            textContainer.replaceChildren(loadingTemplate.content.cloneNode(true));
        }

        if(data.member.color) {
            this.assignColor(data.member.color);
        }
    }

    /**
     * @param {string} id 
     */
    assignId(id) {
        this.id = id;
    }

    /**
     * @param {string} color 
     */
    assignColor(color) {
        this.style.setProperty("--color", `${color}22`);
    }

    /**
     * @param {string} avatarUrl 
     */
    insertAvatar(avatarUrl) {
        const imageContainer = this.querySelector("img");
        imageContainer.src = avatarUrl;
    }

    /**
     * @param {string} name 
     */
    insertName(name) {
        const nameContainer = this.querySelector(".name");
        nameContainer?.prepend(name);
    }
    
    /**
     * @param {string} text 
     */
    replaceText(text) {
        const textContainer = this.querySelector(".message");
        textContainer.replaceChildren(text);
    }
}

if ("customElements" in window) {
    customElements.define("transcription-message", Transcription);
}


/**
 * @typedef {Object} TranscriptionElement
 * @property {string} id
 * @property {Object} member
 * @property {string} member.name
 * @property {string} member.avatar
 * @property {string} member.color
 * @property {string} [text]
 */