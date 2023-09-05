FROM debian

RUN apt-get update && apt-get install -y apache2 && apt-get clean
RUN chown www-data:www-data /var/lock && chown www-data:www-data /var/run/ && chown www-data:www-data /var/log/
ENV APACHE_LOCK_DIR="/var/lock"
ENV APACHE_PID_FILE="/var/run/apache2.pid"
ENV APACHE_RUN_USER="www-data"
ENV APACHE_RUN_GROUP="www-data"
ENV APACHE_LOG_DIR="/var/log/apache2"

ADD public /var/www/html/

LABEL description="Gatsby_Blog"
LABEL version="1.0.0"

USER root

WORKDIR /var/www/html/

VOLUME /var/www/html/
EXPOSE 80

ENTRYPOINT ["/usr/sbin/apachectl"]
CMD ["-D", "FOREGROUND"]