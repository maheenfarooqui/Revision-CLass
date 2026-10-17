import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
  privateKey: "private_ntMGsrusQTQVjIhGyr9A0zvbPhs="
});

async function uploadFile(buffer){
    const response = await client.files.upload({
        file: buffer.toString("base64"),
        fileName: 'image.jpg',
      });
      return response
}
export default uploadFile