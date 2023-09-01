import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
from embedchain import App

UPLOAD_FOLDER = './uploaded-data'
ALLOWED_EXTENSIONS = {'txt', 'pdf'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
cors = CORS(app,
    resources={
        r"/upload": {"origins": "http://localhost:3000"},
        r"/allowed-extensions": {"origins": "http://localhost:3000"},
        r"/query": {"origins": "http://localhost:3000"}
    }
)

# OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
# print(OPENAI_API_KEY)
melon_tusk_bot = App()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
            # check if the post request has the file part
            if 'file' not in request.files:
                flash('No file part')
                return redirect(request.url)
            file = request.files['file']
            # if user does not select file, browser also
            # submit an empty part without filename
            if file.filename == '':
                flash('No selected file')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                melon_tusk_bot.add(filename)
                # return redirect(url_for('upload_file', filename=filename))
                return jsonify({'filename': filename})

@app.route('/get-file/<filename>', methods=['GET'])
def get_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/get-file-list', methods=['GET'])
def get_file_list():
    return jsonify(os.listdir(app.config['UPLOAD_FOLDER']))

@app.route('/delete-file/<filename>', methods=['DELETE'])
def delete_file(filename):
    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return jsonify({'filename': filename})

@app.route('/delete-all-files', methods=['DELETE'])
def delete_all_files():
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return jsonify({'message': 'All files deleted'})


@app.route('/allowed-extensions', methods=['GET'])
def get_allowed_extensions():
    return jsonify(list(ALLOWED_EXTENSIONS))

@app.route('/query', methods=['GET'])
def query():
    if request.method == 'GET':
        query = request.args.get('q')
        print(query)
        try:
            response = melon_tusk_bot.query(query)
            return jsonify({"data": response})
        except Exception as e:
            print(e)
            return jsonify({"data": "Our bad. Oops! Hint: openai key expired???"}), 500
    return jsonify({"data": "Invalid request."}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0')