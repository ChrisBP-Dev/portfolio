import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/image_memory_picked.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/core/utils/unit8list_extension.dart';

class MainImageProjectPicker extends StatefulWidget {
  const MainImageProjectPicker({
    required this.newImage,
    this.imageCharCode,
    super.key,
  });

  final Uint8List? imageCharCode;
  final void Function(String) newImage;

  @override
  State<MainImageProjectPicker> createState() => _MainImageProjectPickerState();
}

class _MainImageProjectPickerState extends State<MainImageProjectPicker> {
  late Uint8List _image;

  @override
  void initState() {
    _image = widget.imageCharCode ?? Uint8List.fromList([]);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ResponsiveCenter(
      maxContentWidth: Breakpoint.mobile,
      child: SizedBox(
        height: 250,
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: ImageMemoryPicked(
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
        ),
      ),
    );
  }
}
