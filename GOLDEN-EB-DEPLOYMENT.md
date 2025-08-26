# 🏆 Golden Elastic Beanstalk Setup for Next.js

This is the **bulletproof** setup for deploying Next.js applications to AWS Elastic Beanstalk using Node.js 22 on Amazon Linux 2023.

## 🎯 **Why This Setup is Golden**

- ✅ **Platform Hooks**: Uses `predeploy` hooks instead of unreliable `postinstall` scripts
- ✅ **Deterministic Builds**: Builds happen on the instance, not locally
- ✅ **Proper Port Binding**: Correctly binds to `$PORT` for EB compatibility
- ✅ **Clean Packaging**: Excludes unnecessary files to prevent CLI hangs
- ✅ **Modern Platform**: Uses Node.js 22 on AL2023 for best performance

## 🚀 **Deployment Options**

### **Option A: AWS CLI Method (Recommended)**
```bash
./deploy-eb-golden.sh
```
- ✅ Bypasses EB CLI completely
- ✅ Most reliable method
- ✅ Full control over the process

### **Option B: EB CLI with Artifact Mode**
```bash
./deploy-eb-artifact.sh
```
- ✅ Uses EB CLI but with pre-built artifact
- ✅ Avoids packaging issues
- ✅ Good for CI/CD integration

## 🏗️ **Architecture Overview**

```
Local Build → Package (git archive/zip) → Upload to S3 → Create App Version → Deploy to Environment
                                    ↓
                            Platform Hook (predeploy)
                                    ↓
                            npm ci --include=dev
                                    ↓
                            npm run build
                                    ↓
                            npm prune --omit=dev
                                    ↓
                            Start Application (npm start)
```

## 📁 **Key Files Created**

- `.platform/hooks/predeploy/00_build.sh` - Build hook that runs on the instance
- `.ebextensions/01_platform.config` - EB configuration for Node.js 22
- `.ebignore` - Comprehensive ignore patterns
- `Procfile` - Explicit start command
- `deploy-eb-golden.sh` - AWS CLI deployment script
- `deploy-eb-artifact.sh` - EB CLI artifact deployment script

## 🔧 **Configuration Details**

### **Platform Hook (.platform/hooks/predeploy/00_build.sh)**
- Runs in staging directory before app promotion
- Installs dependencies including devDependencies
- Runs `npm run build`
- Prunes devDependencies to reduce footprint
- Ensures `.next/` directory exists before `start` runs

### **EB Configuration (.ebextensions/01_platform.config)**
- Node.js 22 platform
- t3.small instance type
- Nginx proxy server
- Static file mappings for Next.js
- Production environment variables

### **Package.json Scripts**
```json
{
  "scripts": {
    "start": "next start -p $PORT -H 0.0.0.0"
  }
}
```
- Binds to `$PORT` (EB requirement)
- Binds to `0.0.0.0` (external access)

## 🚨 **Troubleshooting**

### **If Deployment Fails**
1. Check environment status: `aws elasticbeanstalk describe-environments --environment-names reviews-marketing-fresh-env`
2. View logs: `aws elasticbeanstalk retrieve-environment-info --environment-name reviews-marketing-fresh-env --info-type tail`
3. Check instance logs in EB console

### **Common Issues**
- **Build fails**: Check if devDependencies are available
- **Port binding**: Ensure `$PORT` is used in start command
- **Static files**: Verify `.next/` directory is included in deployment

## 🔄 **Updating the Application**

### **For Code Changes**
1. Make your changes
2. Run `./deploy-eb-golden.sh` (recommended)
3. Or run `./deploy-eb-artifact.sh`

### **For Configuration Changes**
1. Update `.ebextensions/` files
2. Update `.platform/` hooks if needed
3. Redeploy using either method

## 📊 **Monitoring**

### **Check Status**
```bash
aws elasticbeanstalk describe-environments --environment-names reviews-marketing-fresh-env
```

### **View Logs**
```bash
aws elasticbeanstalk retrieve-environment-info --environment-name reviews-marketing-fresh-env --info-type tail
```

### **EB CLI Commands** (if using artifact mode)
```bash
eb status
eb logs
eb open
```

## 🎉 **Success Indicators**

- Environment status shows "Ready" (green)
- Health status shows "Ok" (green)
- Application responds on the EB URL
- `.next/` directory exists on the instance
- Build logs show successful completion

## 🔗 **Next Steps**

1. **Test the deployment** using either script
2. **Configure your domain** to point to the EB environment
3. **Set up monitoring** and alerts
4. **Implement CI/CD** using the artifact deployment method

---

*This setup follows AWS best practices and should provide a rock-solid foundation for your Next.js application on Elastic Beanstalk.*
