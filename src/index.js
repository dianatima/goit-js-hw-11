import axios from 'axios';

const list = document.querySelector('.list');

async function getUser() {
  try {
    const response = await axios.get(
      'https://pixabay.com/api/?key=32083326-5131f12fe438843c4a27c5327&q=cat'
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

getUser().then(res => renderPictures(res.data.hits));

// then(response => console.log(response.data.hits));

function renderPictures(pictures) {
  const pictureElem = pictures
    .map(({ previewURL, likes, views, comments, downloads }) => {
      return `<li class="item">
      <div class="img-wrap">
        <img src="${previewURL}" alt="" />
      </div>
      <ul class="info">
      <li>
        <p>likes</p>
        <p>${likes}</p>
      </li>
      <li>
      <p>views</p>
      <p>${views}</p>
      </li>
      <li>
      <p>comments</p>
      <p>${comments}</p>
      </li>
      <li>
      <p>downloads</p>
      <p>${downloads}</p>
      </li>
      </ul>
  </li>
`;
    })
    .join('');
  list.innerHTML = pictureElem;
}
