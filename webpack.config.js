// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.(png|jpe?g|gif|svg)$/i,
//         use: [
//           {
//             loader: "file-loader",
//             options: {
//               name: "[path][name].[ext]"
//             }
//           }
//         ]
//       }
//     ]
//   }
// };

// // --- ADD THIS SECTION BELOW ---
//   devServer: {
//     allowedHosts: [
//       'www.aii.et',
//       'aii.et'
//     ]
//   };

module.exports = {
  // Keep your existing module rules...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      }
    ]
  },
  
  // --- ADD THIS SECTION BELOW ---
  devServer: {
    allowedHosts: [
      'https://aii.et/Home',
      'aii.et'
    ]
  }
};