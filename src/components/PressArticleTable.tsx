import { type PressArticle, type PressCategory } from "@/data/pressArchive";
import { cn } from "@/lib/utils";

const ArticleTitle = ({ article }: { article: PressArticle }) => {
  if (article.unavailable || !article.href) {
    return <span className="italic text-muted-foreground">{article.title}</span>;
  }

  return (
    <a
      href={article.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {article.title}
    </a>
  );
};

export const PressArticleTable = ({
  category,
  className,
}: {
  category: PressCategory;
  className?: string;
}) => (
  <div className={cn("overflow-x-auto rounded-lg border border-border", className)}>
    <table className="w-full min-w-[640px] border-collapse text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/50">
          <th className="w-[130px] whitespace-nowrap px-4 py-2.5 text-left font-heading font-semibold text-foreground">
            Date
          </th>
          <th className="w-[180px] px-4 py-2.5 text-left font-heading font-semibold text-foreground">
            Publication
          </th>
          <th className="px-4 py-2.5 text-left font-heading font-semibold text-foreground">Article</th>
        </tr>
      </thead>
      <tbody>
        {category.articles.map((article, index) => (
          <tr
            key={`${article.date}-${article.publication}-${article.title}-${index}`}
            className={cn(
              "border-b border-border last:border-b-0",
              article.featured && "bg-primary/5 font-medium",
            )}
          >
            <td className="whitespace-nowrap px-4 py-2.5 align-top text-muted-foreground">{article.date}</td>
            <td className="px-4 py-2.5 align-top text-foreground">{article.publication}</td>
            <td className="px-4 py-2.5 align-top">
              <ArticleTitle article={article} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
