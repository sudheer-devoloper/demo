// client/components/BlogCard.tsx
interface BlogCardProps {
    title: string;
    content: string;
    author: string;
  }
  
  const BlogCard = ({ title, content, author }: BlogCardProps) => {
    return (
      <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-2">{content}</p>
        <span className="text-sm text-gray-500">By {author}</span>
      </div>
    );
  };
  
  export default BlogCard;
  