export type Response = {
    startTime: Date;
    endTime: Date;
  };
  
  export default class Queue {
    private hashQueues: object;
    private executePromises: boolean = false;
  
    constructor() {
      this.initiateExecution();
    }
  
    public async addToQueue(id: string, promise: Promise<Response>) {
      if (this.checkQueue(id)) this.hashQueues[id].push(promise);
  
      this.checkQueue[id] = [...this.checkQueue[id], promise];
  
      if (this.executePromises) await this.executeQueue();
  
      return true;
    }
  
    private checkQueue(id: string) {
      const isInHash: boolean = Object.keys(this.hashQueues).includes(id);
  
      return isInHash;
    }
  
    private buildExecutionQueue() {
      const promises: Array<Promise<void>> = Object.keys(this.hashQueues).map(
        id => this.createPromiseChaining(this.hashQueues[id])
      );
  
      return promises;
    }
  
    private createPromiseChaining(array: Array<Promise<Response>>) {
      const promiseChain: Promise<any> = array.reduce(
        async (prevPromise, currentPromise) => {
          await prevPromise;
          return currentPromise;
        }
      );
  
      return promiseChain;
    }
  
    private async executeQueue() {
      try {
        const promises = this.buildExecutionQueue();
        await Promise.all(promises);
        this.hashQueues = {};
        this.executePromises = false;
      } catch (error) {
        throw error;
      }
    }
  
    private initiateExecution() {
      setInterval(() => {
        this.executePromises = true;
      }, 10000);
    }
  }