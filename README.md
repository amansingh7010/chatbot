# chatbot

A chatbot that uses HuggingFace GPT-2 model and ElasticSearch Vector DB

## About the project

This chatbot is built on a microservice architecture with two microservices: `client` and `server`, managed by Docker and Kubernetes. The development workflow is overseen by Skaffold (https://skaffold.dev), which handles the processes of building, pushing, and deploying our application.

1. Multiple microservices can be added, and different teams can work on the project independently.
2. Asynchronous communication using an event bus/message streaming service like JetStream or Kafka can be easily configured.
3. GitHub workflows are in place for CI/CD. These workflows include automated tests upon the creation of a pull request and automated deployment when code is pushed to the `main` branch.

The `client` is a React application created using `"create-react-app"`.

The `server` is an Express application that stores the message in a ElasticSearch vector db and responds to user messages using Hugging Face GPT2 Inference API.

## Setup Instructions

#### Development Tools

The following development tools must be installed (in the same order) on your machine before you begin editing the code.

1. Docker Desktop. (https://www.docker.com/products/docker-desktop)
2. Enable Kubernetes from Settings in Docker Desktop. Before proceeding, make sure that docker and kubernetes are running and configured correctly.
3. `ingress-nginx` for Docker Desktop. (https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop). I recommend using `kubectl` to install `ingress-nginx` with the following command.<pre>kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/aws/deploy.yaml</pre>
4. Save your Hugging Face API key in a Kubernetes secret
<pre>kubectl create secret generic hf-api-key --from-literal=HF_API_KEY="your api key"</pre>
5. Skaffold (https://skaffold.dev)
6. Edit your `hosts` file and add `"127.0.0.1 chatbot.amansingh.dev"` at the end of the file. Editing this file require admin privileges. `hosts` file can be found at:  
   &emsp;&emsp; Windows - `C:\Windows\System32\drivers\etc`  
   &emsp;&emsp; Mac & Linux - `/etc/hosts`

#### Steps to run the project locally

1. Clone the repository.
2. Pull the required images from docker hub using the following command or build the images locally.<pre>docker pull amansinghs/chatbot-client && docker pull amansinghs/chatbot-server</pre>
3. Run the following command from the project root directory.<pre>skaffold dev</pre>
4. Visit `chatbot.amansingh.dev` from your web browser.
5. Your web browser will show you an HSTS error because of self-signed SSL certificate from Kubernetes. Type `"thisisunsafe"` anywhere in the browser window to bypass this screen. Note that this is only for development environment. Correct SSL certificate is already in place for production environment.

Skaffold will automatically create the required `Deployments` and `Services`. If you edit any file, it will re-deploy the latest changes. See `skaffold.yaml` for details.

Note 1: Elasticsearch deployment on Kubernetes cluster takes 10-30 seconds to stabilize. After the server is up and running, please give it a minute before making any request. Otherwise, the request will simply fail.

Note 2: There is a known bug with Skaffold where the deployments fail to stabilize sometimes. (https://github.com/GoogleContainerTools/skaffold/issues/8972). Just add `"--tolerate-failures-until-deadline"` flag with `"skaffold dev"` command.

<pre>skaffold dev --tolerate-failures-until-deadline</pre>

## APIs Endpoints

#### chatbot-server API

<details>
 <summary><code>POST</code> <code><b>/api/chat</b></code> <code>(Sends message to HF GPT2 model and responds back)</code></summary>

##### Parameters

> | name    | type     | data type | description |
> | ------- | -------- | --------- | ----------- |
> | message | required | string    | user input  |

##### Responses

> | http code | content-type               | response                                                         |
> | --------- | -------------------------- | ---------------------------------------------------------------- |
> | `201`     | `application/json        ` | `{botResponse: "Some Response from GPT2"}`                       |
> | `400`     | `application/json`         | `{errors: [{message: 'Message is required', field: 'message'}]}` |
> | `500`     | `application/json`         | `{errors: [{message: 'Something went wrong'}]}`                  |

</details>

## Suggested Improvements

1. Data is only being saved in ElasticSearch vector DB. Use the saved data to respond to user messages.
2. Considering that I only spent 3-4 hours on this, the bot responses are kinda 'dumb'. So, they can definitely be improved.
3. Better error handling on the front-end.
