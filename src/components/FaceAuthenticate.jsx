import React, { useState, useEffect } from "react";

const FaceAuthenticate = () => {
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  useEffect(() => {
    console.log(image1);
    console.log(image2);
  }, [image1, image2]);

  return (
    <div>
        <form action="https://api.deepai.org/api/image-similarity" id="example-form" >
	<label for="image1">
    image1
	</label>
    <input
        type="text"
        onChange={(e) => setImage1(e.target.value)}
        placeholder="Image 1"
        value={image1}
        name="image1"
        id="image1"
      />

	<label for="image2">
    image2
	</label>
        <input
        type="text"
        onChange={(e) => setImage2(e.target.value)}
        placeholder="Image 2"
        value={image2}
        name="image2"
        id="image2"
      />
    <button type="submit"
     onClick={async (e) => {
        console.log("in fetch");
          e.preventDefault();
          const formData = new FormData();
            formData.append("image1", image1);
            formData.append("image2", image2);
         const response = await fetch(
          "https://api.deepai.org/api/image-similarity",
          {
            method: "POST",
            headers: {
              "api-key": `a60e800c-3881-41e2-89e2-ab4efeea272f`,
            },
            body : formData,
            redirect: 'follow'
          }
        );
        const data = await response.text();
        console.log(data);
      }}
    >Submit</button>
	</form>
    </div>
  );
};

export default FaceAuthenticate;
