FROM python:3.11 AS backend

WORKDIR /usr/src/api
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

CMD OPENAI_API_KEY=$OPENAI_API_KEY flask --app server.py run --host=0.0.0.0


# docker build -t melon-tusk-server --build-arg=$OPENAI_API_KEY .