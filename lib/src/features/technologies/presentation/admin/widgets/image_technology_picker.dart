import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/image_memory_picked.dart';
import 'package:portfolio/src/core/utils/unit8list_extension.dart';

class ImageTechnologyPicker extends StatefulWidget {
  const ImageTechnologyPicker({
    required this.newImage,
    this.imageCharCode,
    super.key,
  });

  final Uint8List? imageCharCode;
  final void Function(String) newImage;

  @override
  State<ImageTechnologyPicker> createState() => _ImageTechnologyPickerState();
}

class _ImageTechnologyPickerState extends State<ImageTechnologyPicker> {
  late Uint8List _image;

  @override
  void initState() {
    _image = widget.imageCharCode ?? Uint8List.fromList([]);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: ImageMemoryPicked(
        height: 100,
        width: 100,
        imageCharCode: _image,
        onImageAdded: (newImage) {
          setState(() => _image = newImage);
          widget.newImage(newImage.codeUnitsString);
        },
        deleteTap: () {
          setState(() => _image = Uint8List.fromList([]));
          widget.newImage('');
        },
      ),
    );
  }
}
