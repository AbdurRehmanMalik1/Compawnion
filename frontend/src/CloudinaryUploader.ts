const CloudinaryUploader = {
    cloudName: "dnjyfb0sg",
    uploadPreset: "pet_app",

    async upload(file: string | Blob) {
        if (!file) throw new Error("No file provided");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", this.uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        const data = await response.json();
        return data.secure_url; // or return full data if needed
    }
};

export default CloudinaryUploader;