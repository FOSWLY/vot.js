import { BaseHelper } from "./base.js";
export default class CoursetrainHelper extends BaseHelper {
    API_ORIGIN = "https://coursetrain.net";
    async getCourseId(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/course/${videoId}`);
            const content = await res.text();
            return /course_id(\s)?=(\s)?([\d]+)/.exec(content)?.[3];
        }
        catch (err) {
            console.error(`Failed to get Coursetrain courseId by videoId: ${videoId}`, err.message);
            return false;
        }
    }
    async getLessonsData(courseId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/api/v1/course/${courseId}/lessons`);
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get Coursetrain lessons data by courseId: ${courseId}`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        const courseId = await this.getCourseId(videoId);
        if (!courseId) {
            return undefined;
        }
        const lessonsData = await this.getLessonsData(courseId);
        if (!lessonsData) {
            return undefined;
        }
        const lessonId = +(videoId.split("?lesson=")?.[1] ?? 1);
        const currentLesson = lessonsData?.[lessonId - 1];
        const { file: videoUrl, duration, title } = currentLesson;
        if (!videoUrl) {
            return undefined;
        }
        return {
            url: videoUrl,
            duration,
            title,
        };
    }
    async getVideoId(url) {
        const courseId = /\/course\/([^/]+)/.exec(url.pathname)?.[1];
        return courseId ? courseId + url.search : undefined;
    }
}
