document.addEventListener("DOMContentLoaded", function () {

    // Get HTML elements
    const inputText = document.getElementById("inputText");
    const translatedText = document.getElementById("translatedText");

    const sourceLanguage = document.getElementById("sourceLanguage");
    const targetLanguage = document.getElementById("targetLanguage");

    const translateButton = document.getElementById("translateButton");
    const copyButton = document.getElementById("copyButton");
    const speakButton = document.getElementById("speakButton");
    const clearButton = document.getElementById("clearButton");

    const buttonText = document.getElementById("buttonText");
    const loadingSpinner = document.getElementById("loadingSpinner");

    const statusMessage = document.getElementById("statusMessage");
    const charCount = document.getElementById("charCount");


    // Check that JavaScript is loaded
    console.log("Translation Tool JavaScript loaded successfully");


    // Character counter
    inputText.addEventListener("input", function () {

        charCount.textContent = inputText.value.length;

    });


    // ==============================
    // TRANSLATE BUTTON
    // ==============================

    translateButton.addEventListener("click", async function () {

        const text = inputText.value.trim();
        const source = sourceLanguage.value;
        const target = targetLanguage.value;


        // Check empty text
        if (text === "") {

            showStatus(
                "Please enter some text to translate.",
                "error"
            );

            return;
        }


        // Check same language
        if (source !== "auto" && source === target) {

            showStatus(
                "Source and target languages cannot be the same.",
                "error"
            );

            return;
        }


        // Loading
        translateButton.disabled = true;

        buttonText.textContent = "Translating...";

        if (loadingSpinner) {
            loadingSpinner.classList.remove("hidden");
        }


        showStatus("", "");


        try {

            console.log("Sending translation request...");
            console.log("Text:", text);
            console.log("Source:", source);
            console.log("Target:", target);


            const response = await fetch("/translate", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: text,
                    source: source,
                    target: target
                })

            });


            console.log("Server response status:", response.status);


            const data = await response.json();

            console.log("Server response:", data);


            if (response.ok && data.success) {

                translatedText.value = data.translation;

                showStatus(
                    "Translation completed successfully!",
                    "success"
                );

            } else {

                translatedText.value = "";

                showStatus(
                    data.message || "Translation failed.",
                    "error"
                );

            }


        } catch (error) {

            console.error("Translation error:", error);

            showStatus(
                "Could not connect to the translation server.",
                "error"
            );

        }


        // Stop loading
        translateButton.disabled = false;

        buttonText.textContent = "Translate";

        if (loadingSpinner) {
            loadingSpinner.classList.add("hidden");
        }

    });


    // ==============================
    // COPY BUTTON
    // ==============================

    copyButton.addEventListener("click", async function () {

        const text = translatedText.value.trim();


        if (text === "") {

            showStatus(
                "There is no translated text to copy.",
                "error"
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(text);

            showStatus(
                "Translated text copied successfully!",
                "success"
            );

        } catch (error) {

            console.error("Copy error:", error);


            // Fallback copy method
            translatedText.select();

            document.execCommand("copy");

            showStatus(
                "Translated text copied successfully!",
                "success"
            );

        }

    });


    // ==============================
    // SPEAK BUTTON
    // ==============================

    speakButton.addEventListener("click", function () {

        const text = translatedText.value.trim();


        if (text === "") {

            showStatus(
                "There is no translated text to speak.",
                "error"
            );

            return;
        }


        // Check browser support
        if (!("speechSynthesis" in window)) {

            showStatus(
                "Text-to-speech is not supported by this browser.",
                "error"
            );

            return;
        }


        // Stop previous speech
        window.speechSynthesis.cancel();


        const speech = new SpeechSynthesisUtterance(text);


        // Set language
        speech.lang = getSpeechLanguage(
            targetLanguage.value
        );


        speech.rate = 0.9;

        speech.pitch = 1;


        speech.onstart = function () {

            showStatus(
                "Reading translated text...",
                "success"
            );

        };


        speech.onend = function () {

            showStatus(
                "Finished speaking.",
                "success"
            );

        };


        speech.onerror = function (event) {

            console.error("Speech error:", event);

            showStatus(
                "Unable to speak the translated text.",
                "error"
            );

        };


        window.speechSynthesis.speak(speech);

    });


    // ==============================
    // CLEAR BUTTON
    // ==============================

    clearButton.addEventListener("click", function () {

        inputText.value = "";

        translatedText.value = "";

        charCount.textContent = "0";

        showStatus("", "");

        inputText.focus();

    });


    // ==============================
    // STATUS MESSAGE
    // ==============================

    function showStatus(message, type) {

        statusMessage.textContent = message;

        statusMessage.className = "status-message";


        if (type === "success") {

            statusMessage.classList.add("status-success");

        }


        if (type === "error") {

            statusMessage.classList.add("status-error");

        }

    }


    // ==============================
    // SPEECH LANGUAGE
    // ==============================

    function getSpeechLanguage(language) {

        const languageMap = {

            "en": "en-US",

            "hi": "hi-IN",

            "mr": "mr-IN",

            "gu": "gu-IN",

            "bn": "bn-IN",

            "ta": "ta-IN",

            "te": "te-IN",

            "kn": "kn-IN",

            "ml": "ml-IN",

            "pa": "pa-IN",

            "fr": "fr-FR",

            "de": "de-DE",

            "es": "es-ES",

            "it": "it-IT",

            "pt": "pt-PT",

            "ru": "ru-RU",

            "ja": "ja-JP",

            "ko": "ko-KR",

            "zh-CN": "zh-CN"

        };


        return languageMap[language] || "en-US";

    }

});
