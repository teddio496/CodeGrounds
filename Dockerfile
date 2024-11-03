# Base image
FROM ubuntu:22.04

# Set environment variables to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC
ENV PATH="/root/.cargo/bin:${PATH}"

# Update and install necessary tools and languages
RUN apt-get update && apt-get install -y --no-install-recommends \
    # General tools
    bash \
    build-essential \
    software-properties-common \
    wget \
    curl \
    git \
    unzip \
    # Python
    python3 \
    python3-pip \
    # Java
    openjdk-17-jdk \
    # C and C++ compilers
    gcc \
    g++ \
    # Ruby
    ruby \
    # Go
    golang \
    # PHP
    php \
    # Haskell
    ghc \
    # Perl
    perl \
    # Swift
    && wget https://download.swift.org/swift-6.0.2-release/ubuntu2204/swift-6.0.2-RELEASE/swift-6.0.2-RELEASE-ubuntu22.04.tar.gz \
    && tar -xvzf swift-6.0.2-RELEASE-ubuntu22.04.tar.gz \
    && mv swift-6.0.2-RELEASE-ubuntu22.04 /usr/share/swift \
    && ln -s /usr/share/swift/usr/bin/* /usr/local/bin/ \
    # Node.js (Install the latest version from NodeSource)
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    # TypeScript
    && npm install -g typescript \
    # Rust
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    # Clean up
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /code

# Default command to prevent container from exiting immediately
CMD ["bash"]
