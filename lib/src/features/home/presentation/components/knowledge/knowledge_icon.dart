import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class KnowledgeIcon extends StatelessWidget {
  const KnowledgeIcon({required this.urlSvg, super.key, this.size});
  final String urlSvg;
  final double? size;

  @override
  Widget build(BuildContext context) {
    return SvgPicture.network(
      urlSvg,
      height: size ?? 42,
      width: size ?? 42,
      placeholderBuilder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
