Run dev server:
```
docker build --target=dev --tag=m2farzan/learncontrol:dev .
docker run -p 80:80 -v $(pwd):/src:ro -v learncontrolnodemodules:/node_modules m2farzan/learncontrol:dev
```
You don't have to rebuild the container unless there are new dependencies.

Run production server:
```
docker build  --target=production --tag=m2farzan/learncontrol:latest .
docker push m2farzan/learncontrol:latest
```
And in kubernetes:
```
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: learncontrol
  name: learncontrol
spec:
  replicas: 2
  selector:
    matchLabels:
      app: learncontrol
  template:
    metadata:
      labels:
        app: learncontrol
    spec:
      containers:
      - name: learncontrol
        image: "m2farzan/learncontrol"
        ports:
          - containerPort: 80
        resources:
          limits:
            cpu: 1000m
            memory: 500M
            ephemeral-storage: 200M
          requests:
            cpu: 1000m
            memory: 500M
            ephemeral-storage: 200M
```