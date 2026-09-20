FROM mambaorg/micromamba:2.9.0

# Install Python, Django, and the spatial libraries.
COPY --chown=$MAMBA_USER:$MAMBA_USER environment.yml /tmp/environment.yml

RUN micromamba install --yes --name base --file /tmp/environment.yml && \
    micromamba clean --all --yes

# Create a writable directory for the application.
RUN mkdir -p /home/mambauser/app
WORKDIR /home/mambauser/app

COPY --chown=$MAMBA_USER:$MAMBA_USER . .

# Library locations inside this Linux container.
ENV GDAL_LIBRARY_PATH=/opt/conda/lib/libgdal.so \
    GEOS_LIBRARY_PATH=/opt/conda/lib/libgeos_c.so \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Collect static assets, then start the production web server.
CMD ["bash", "-c", "python manage.py collectstatic --noinput && exec gunicorn _crud.wsgi:application --bind 0.0.0.0:${PORT:-10000} --workers 1 --threads 2 --access-logfile - --error-logfile -"]