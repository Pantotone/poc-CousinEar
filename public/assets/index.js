const transcriptionsContainer = document.getElementById("transcriptions");

const socket = io();

const urlParams = new URLSearchParams(document.location.search);
const userId = urlParams.get("userId");
const languages = urlParams.get("languages")?.trim().split(",").map(language => language.trim());

const languagesNames = {
    "en-US": "English",
    "pt-BR": "Português"
};

socket.on("NewTranscription", (data) => {
    console.log(data);

    if(userId && data.member.id !== userId) return;

    if(languages) {

        languages.forEach(language => {
            const element = new Transcription({
                ...data,
                member: {
                    ...data.member,
                    name: languagesNames[language] || language
                }
            });

            element.dataset.language = language;
            transcriptionsContainer.append(element);

            if(transcriptionsContainer.dataset.autoScroll === "true") {
                element.scrollIntoView({behavior: "smooth"});
            }
        });

    } else {
        const element = new Transcription(data);
        transcriptionsContainer.append(element);

        if(transcriptionsContainer.dataset.autoScroll === "true") {
            element.scrollIntoView({behavior: "smooth"});
        }
    }
});

socket.on("UpdateTranscription", (data) => {

    if(languages) {

        languages.forEach(language => {
            const element = document.querySelector(`[data-id="${data.id}"][data-language="${language}"]`);
            element.replaceText(data.translations?.[language]);

            if(transcriptionsContainer.dataset.autoScroll === "true") {
                element.scrollIntoView({behavior: "smooth"});
            }
        });

    } else {
        const element = document.getElementById(data.id);
        element.replaceText(data.text);
    
        if(transcriptionsContainer.dataset.autoScroll === "true") {
            element.scrollIntoView({behavior: "smooth"});
        }
    }

});

socket.on("EndTranscription", (data) => {
    const elements = document.querySelectorAll(`[data-id="${data.id}"]`);
    elements.forEach(element => {
        element.setLoading(false);
    
        // Eliminate transcription element if there's no text
        if(element?.text.length <= 0) {
            element.remove();
        }
    });
});

class Transcription extends HTMLElement {
    text = "";

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
        this.dataset.id = id;
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
        if(!imageContainer) return;
        
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
        this.text = text;

        const textContainer = this.querySelector(".message > span.text");
        textContainer.textContent = text;
    }

    /**
     * @param {boolean} isLoading 
     */
    setLoading(isLoading) {
        const loadingContainers = this.querySelectorAll(".loading");
        loadingContainers.forEach(container => {
            if(container instanceof HTMLElement) {
                container.dataset.isLoading = isLoading;
            }
        });
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