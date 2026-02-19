import pika
import os
import json
from flask import Flask, jsonify

app = Flask(__name__)

RABBIT_HOST = os.getenv("RABBIT_HOST", "rabbitmq")
ORDER_QUEUE = "order_queue"

@app.route("/health")
def health():
    return jsonify({"service": "payment-service", "status": "running"})

def start_consumer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=RABBIT_HOST)
    )
    channel = connection.channel()
    channel.queue_declare(queue=ORDER_QUEUE, durable=True)

    def callback(ch, method, properties, body):
        order = json.loads(body.decode())
        print("💳 Processing payment for order:", order)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue=ORDER_QUEUE, on_message_callback=callback)
    channel.start_consuming()

if __name__ == "__main__":
    import threading
    threading.Thread(target=start_consumer, daemon=True).start()
    app.run(host="0.0.0.0", port=5000)
