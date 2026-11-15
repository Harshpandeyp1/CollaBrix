import api from './api';

export const improveIdea=async({title, description})=>{
    const response = await api.post(
    "/ai/improve-idea",
    { title, description },     // becomes the JSON body (matches ImproveIdeaRequest)
    { timeout: 30000 }
  );
  return response.data; // matches ImproveIdeaResponse
};

export const planFromIdea = async (ideaId) => {
  const response = await api.post(
    `/ai/ideas/${ideaId}/plan`,
    {},
    { timeout: 30000 }
  );
  return response.data;
};

export const aiErrorMessage=(error) => {
    if(error.code==="ECONNABORTED"){
        return "AI took too long to respond. Please try again.";
    }

    if(!error.response){
        return "The AI service is unavailable. Please try again shortly.";
    }

    if(error.response.status===429){
        return "The AI service is busy right now. Please try again shortly.";
    }
    return error.response.data?.message || "Unable to complete the AI request.";
};