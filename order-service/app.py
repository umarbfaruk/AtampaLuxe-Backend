from flask import Flask, request, jsonify
from flask_cors import CORS
import pika
import os
import json

app = Flask(__name__)
CORS(app)

RABBIT_HOST = os.getenv("RABBIT_HOST", "rabbitmq")
ORDER_QUEUE = "order_queue"

@app.route("/order", methods=["POST"])
def create_order():
    data = request.json

    if not data:
        return jsonify({"message": "Invalid order"}), 400

    # Send order to RabbitMQ
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=RABBIT_HOST)
    )
    channel = connection.channel()
    channel.queue_declare(queue=ORDER_QUEUE, durable=True)

    channel.basic_publish(
        exchange="",
        routing_key=ORDER_QUEUE,
        body=json.dumps(data),
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()

    return jsonify({
        "message": "Order placed successfully",
        "order": data
    })

@app.route("/health")
def health():
    return jsonify({"service": "order-service", "status": "running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
