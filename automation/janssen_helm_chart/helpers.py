"""

 License terms and conditions for Janssen Cloud Native Edition:
 https://www.apache.org/licenses/LICENSE-2.0
"""
import logging
import errno
import shutil


def get_logger(name):
    """

    Set logger configs with name.
    :param name:
    :return:
    """
    log_format = '%(asctime)s - %(name)8s - %(levelname)5s - %(message)s'
    logging.basicConfig(level=logging.INFO,
                        format=log_format,
                        filename='setup.log',
                        filemode='w')
    console = logging.StreamHandler()
    console.setLevel(logging.INFO)
    console.setFormatter(logging.Formatter(log_format))
    logging.getLogger(name).addHandler(console)
    return logging.getLogger(name)


logger = get_logger("cn-helpers   ")


def copy(src, dest):
    """
    
    Copy from source to destination
    :param src:
    :param dest:
    """
    try:
        shutil.copytree(src, dest)
    except OSError as e:
        # If the error was caused because the source wasn't a directory
        if e.errno == errno.ENOTDIR:
            shutil.copy(src, dest)
        else:
            logger.error('Directory not copied. Error: {}'.format(e))
