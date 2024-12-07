FROM rust:latest

# Set the working directory
WORKDIR /usr/src/backend

# Copy the Rust project files
COPY . .

# Build the Rust project
RUN cargo build --release

# Expose the backend port
EXPOSE 8080

# Run the Rust server
CMD ["cargo", "run", "--release"]
