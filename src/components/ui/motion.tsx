'use client';
import * as React from 'react';

let motionImpl: any = null;
try { 
  motionImpl = require('framer-motion').motion; 
} catch {}

const asAny = (Comp: any) => Comp as any;

export const m = {
  div: (motionImpl?.div ?? asAny((p: React.HTMLAttributes<HTMLDivElement>) => <div {...p} />)),
  span: (motionImpl?.span ?? asAny((p: React.HTMLAttributes<HTMLSpanElement>) => <span {...p} />)),
  section: (motionImpl?.section ?? asAny((p: React.HTMLAttributes<HTMLElement>) => <section {...p} />)),
};
