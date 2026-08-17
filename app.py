from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():

    try:

        data = request.get_json()

        text = data.get("text", "").strip()
        source = data.get("source", "auto")
        target = data.get("target", "en")


        # Check empty input
        if not text:

            return jsonify({
                "success": False,
                "message": "Please enter some text."
            }), 400


        print("\n========== TRANSLATION ==========")
        print("Text:", text)
        print("Source:", source)
        print("Target:", target)


        # Perform translation
        translator = GoogleTranslator(
            source=source,
            target=target
        )


        translated_text = translator.translate(text)


        print("Translation:", translated_text)
        print("=================================\n")


        return jsonify({

            "success": True,

            "translation": translated_text

        })


    except Exception as e:

        print("ERROR:", str(e))


        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )