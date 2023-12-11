import useAxios from ".";

export const GetAllWatch = async () => {
  try {
    const response = await useAxios.get("/watch-laters", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const GetMyWatchLaters = async () => {
  const id = JSON.parse(sessionStorage.getItem("user")).id;

  try{
    const response = await useAxios.get(`/watch-laters/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
      },
    });
    // console.log("Response Data:", response.data);
    return response.data.data;
  }catch(error){
    console.error("Error:", error); 
    throw error.response.data;
  }
}

export const createWatch = async (data) => {
  try {
    const response = await useAxios.post("/watch-laters", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    // console.log(error.response.data.message);
    throw error.response.data.message;
  }
};

export const DeleteWatch = async (id) => {
  try {
    const response = await useAxios.delete(`/watch-laters/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
