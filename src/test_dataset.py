import kagglehub

# Download latest version
path = kagglehub.dataset_download("amitanshjoshi/spotify-1million-tracks")

print("Path to dataset files:", path)