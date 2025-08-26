import { IVideo } from "@/models/Video";

export type videoFormData = Omit<IVideo, "_id">;
type FetchOptions = {
  Method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  // Query?: string
  // Body?: string
  // url: string
  // params?: any
};

class ApiClient {
  private async fetch<T>(
    endPoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const {
      Method = "GET",
      headers = {},
      body,
      // Query,
      // Body,
      // url,
      // params,
    } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };
    const response = await fetch(`/api/${endPoint}`, {
      method: Method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return data;
  }

  async getVideos() {
    return this.fetch("/video");
  }

  async uploadVideo(videoData: videoFormData) {
    return this.fetch("/video", {
      Method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
