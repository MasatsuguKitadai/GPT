from flask import Flask, Response
import openai
from openai.error import RateLimitError

openai.api_key = "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"

app = Flask(__name__)


@app.route("/")
def home():
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Who won the world series in 2020?"},
            ],
        )
        output_text = response["choices"][0]["message"]["content"]

        return Response(
            output_text,
            mimetype="text/plain",
            headers={"Content-disposition": "attachment; filename=gpt_output.txt"},
        )
    except RateLimitError:
        return "You have exceeded your API quota. Please try again later."


if __name__ == "__main__":
    app.run(port=5000)
