import ProcessModel from '../src/models/Process.mjs';

class ProcessRepository {
  // eslint-disable-next-line class-methods-use-this
  async save(process) {
    const newProcess = new ProcessModel();
    newProcess.filters = process.filters;
    newProcess.files = process.files;
    await newProcess.save();
    return newProcess;
  }
}

export default ProcessRepository;
