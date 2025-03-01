"use strict"
export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
};
