# Use a base image, e.g., nginx to serve your app
FROM nginx:latest

# Set the working directory (this is where Nginx serves files from)
WORKDIR /usr/share/nginx/html

# Copy the entire assets folder into the container
COPY assets /usr/share/nginx/html/assets

# Optionally, copy other files like index.html if needed
COPY index.html /usr/share/nginx/html/

# Expose the port Nginx will listen on
EXPOSE 80
