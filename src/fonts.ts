import localFont from 'next/font/local'

// export const inter = localFont({
//     src: "/assets/fonts/Inter_18pt-Black.ttf",
//     display: "swap",
//     variable: "--font-inter",
//   });

export const interRegular = localFont({
  src: '../public/assets/fonts/Inter_18pt-Regular.ttf',
  display: 'swap',
  variable: '--font-inter-regular',
});

export const interSemiBold = localFont({
    src: "../public/assets/fonts/Inter_24pt-SemiBold.ttf",
    display: "swap",
    variable: "--font-inter-semibold",
  });

export const interMedium = localFont({
    src: "../public/assets/fonts/Inter_24pt-Medium.ttf",
    display: "swap",
    variable: "--font-inter-medium",
  });

  export const interBold = localFont({
    src: "../public/assets/fonts/Inter_24pt-Bold.ttf",
    display: "swap",
    variable: "--font-inter-bold",
  });