import { pageStyles, typography } from "@/lib/design-system";

const Index = () => {
  return (
    <div className={`flex items-center justify-center ${pageStyles.wrapper}`}>
      <div className="text-center">
        <h1 className={`mb-4 ${typography.pageTitle}`}>Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    </div>
  );
};

export default Index;
