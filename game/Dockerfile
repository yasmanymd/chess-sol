FROM golang:1.16.6

RUN go get -u github.com/cespare/reflex

COPY reflex.conf /usr/local/etc/
COPY build.sh /usr/local/bin/

RUN chmod 755 /usr/local/bin/build.sh

WORKDIR /app

COPY go.mod go.sum ./
COPY . .

EXPOSE 5000

CMD ["reflex", "-d", "none", "-c", "/usr/local/etc/reflex.conf"]