export class CreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class CreatePostToBlogDto {
  title: string;
  shortDescription: string;
  content: string;
}
