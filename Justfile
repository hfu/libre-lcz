# Justfile for libre-lcz

# Install dependencies
install:
    npm install

# Run development server
dev:
    npm run dev

# Build for production
build:
    npm run build

# Preview production build
preview:
    npm run preview

# Clean build artifacts
clean:
    rm -rf docs/ node_modules/

# Default recipe
default: build
