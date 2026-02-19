#!/bin/sh
# wait-for-it.sh (POSIX safe)

HOSTPORT="$1"
shift

# Remove optional "--"
if [ "$1" = "--" ]; then
  shift
fi

HOST="$(echo "$HOSTPORT" | cut -d: -f1)"
PORT="$(echo "$HOSTPORT" | cut -d: -f2)"

echo "Waiting for postgres at $HOST:$PORT..."

until pg_isready -h "$HOST" -p "$PORT" > /dev/null 2>&1
do
  sleep 1
done

echo "Postgres is ready! Starting service..."
exec "$@"
