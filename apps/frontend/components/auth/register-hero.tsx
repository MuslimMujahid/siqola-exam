import { motion } from "framer-motion";

export function RegisterHero() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden lg:flex flex-col justify-center px-12 xl:px-20 bg-muted/30"
    >
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            SiqolaExam
          </h2>
          <p className="text-lg text-muted-foreground">
            Join our family and we&apos;ll help you manage exams with ease.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 mt-1">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Easy Setup</h3>
              <p className="text-sm text-muted-foreground">
                Get up and running in minutes with our intuitive platform.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 mt-1">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Powerful Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track performance and gain insights with detailed reports.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 mt-1">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Our team is always here to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
