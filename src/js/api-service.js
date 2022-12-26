async function getPictures() {
  try {
    const response = await axios.get(
      'https://pixabay.com/api/?key=32083326-5131f12fe438843c4a27c5327&q=cat'
    );
    console.log('1111111111111');
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export default { getPictures };
