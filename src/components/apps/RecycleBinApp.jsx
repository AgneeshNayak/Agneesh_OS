import React, { memo } from 'react';
import { motion } from 'framer-motion';

const RecycleBinApp = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white bg-gray-900/50 p-6 font-mono">
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="text-8xl mb-6 cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      >
        🗑️
      </motion.div>
      <h2 className="text-2xl font-bold tracking-widest text-gray-200">RECYCLE BIN</h2>
      <p className="text-gray-400 mt-2">Empty — 0 items</p>
      <div className="mt-8 pt-4 border-t border-gray-800 w-full text-center">
        <p className="text-xs text-gray-600">No deleted files in this session</p>
      </div>
    </div>
  );
});

export default RecycleBinApp;
