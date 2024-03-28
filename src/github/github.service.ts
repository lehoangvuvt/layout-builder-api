import { Injectable } from '@nestjs/common';
import { RestEndpointMethodTypes } from '@octokit/rest';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { Octokit } from 'octokit';

@Injectable()
export class GithubService {
    constructor() { }

    async commit(repo: any, code: string, token: string): Promise<RestEndpointMethodTypes["repos"]["createOrUpdateFileContents"]["response"]['data']['content'] | null> {
        const { owner, name } = repo
        const octokit = new Octokit({
            baseUrl: "https://api.github.com",
            auth: `token ${token}`,
        });
        const OWNER_NAME = owner.login
        const REPO_NAME = name
        const FILE_PATH = `components/${nanoid()}.tsx`
        const AUTHOR_NAME = owner.login
        const AUTHOR_EMAIL = "hoangvule100@gmail.com"
        const user_info = {
            name: AUTHOR_NAME,
            email: AUTHOR_EMAIL
        }
        try {
            const response = await octokit.rest.repos.createOrUpdateFileContents({
                owner: OWNER_NAME,
                repo: REPO_NAME,
                path: FILE_PATH,
                message: "Create file",
                content: Buffer.from(code).toString('base64'),
                committer: { ...user_info },
                author: { ...user_info },
            })
            if (!response.data) return null
            return response.data.content
        } catch (err) {
            return null
        }
    }
    
    async getUserRepos(token: string) {
        try {
            const response = await axios({
                method: "GET",
                url: ` https://api.github.com/user/repos?page=0&per_page=5&sort=created&direction=desc`,
                headers: {
                    Authorization: `token ${token}`,
                },
            })
            const data = response.data
            return data
        } catch (err) {
            return null
        }
    }
}
